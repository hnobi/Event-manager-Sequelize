import models from '../models';
// or import Center from 'models/centers'
// ctrl alt d d for documentation
const { Center, Event } = models;    //const Center = models.Centers

/**
 * 
 * 
 * @export
 * @class CenterController
 */
export default class CenterController {
  static addCenter(req, res) {
    const { name, location, facilities } = req.body;         //const name = req.body.name
    const { userId } = req.decoded;                          //const userId = req.decoded.userId;
    return Center.findOne({ where: { name } }).then((centerfound) => {  // where{name:req.body.name}
      if (centerfound && centerfound.name === name) {
        //(centerfound && centerfound.name === name) means if center is found and center's name is the sma with iputed name
        return res.status(400).json({
          status: 'Failed',
          message: `Center with the name: ${name}, already exist`
        });
      }
      return Center.create({
        name,
        location,
        facilities,
        userId
      }).then((center) => res.status(201)
        .json({
          status: 'Success',
          message: 'Successfully added new center',
          center
        })).catch(error => res.status(500)
          .json({
            status: 'failed',
            message: error.message
          }));

    }).catch(error => res.status(500).json({
      status: 'Failed',
      message: error.message
    }));
  }

  static getAllCenter(req, res) {
    // const { userId } = req.decoded;is used here because unregister user can check centers
    Center.findAll({
      limit: 10, // display only 10 centers from the database
      order: [
        ['createdAt', 'DESC'] //start displaying center from last one created
      ]
    })
      .then((centers) => {
        if (centers) { // if there is center availabe in db
          res.status(200)
            .json({
              status: 'success',
              message: 'successfull retrieved all centers',
              centers
            })
        } else {
          res.status(404)
            .json({
              status: 'failed',
              message: 'No available centers to display'
            });
        }
      })
      .catch(error => res.status(404).json({
        status: 'Failed',
        message: error.message
      }))


  }


  static getSingleCenter(req, res) {
    const { name, location, facilities } = req.body,
      centerId = req.params.centerID;
    Center.findById(centerId, {
      include: [{
        model: Event,

      }]
    }).then((foundcenter) => {
      if (!foundcenter) {
        return res.status(401)
          .json({
            status: 'failed',
            message: `center with id ${centerId}, not found`
          })
      }
      res.status(200)
        .json({
          status: 'success',
          message: 'successfully retrieved a center ',
          foundcenter
        });
    }).catch(error => res.status(500)
      .json({
        status: 'failed',
        message: error.message
      })
    )
  }





}




