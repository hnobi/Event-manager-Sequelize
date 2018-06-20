import models from '../models';


const { Event } = models;

export default class EventController {
  static addEvent(req, res) {
    const { title, location, centerId, descriptions, date } = req.body;

    const { userId } = req.decoded;
    // query db
    return Event.findOne({
      where: {
        centerId, date,
      },
    }).then((event) => {
      if (event) {
        return res.status(400).send({
          message: 'The date chosen is booked, Please select another day',
        });
      }
      return Event.create({
        title,
        location,
        descriptions,
        date,
        centerId,
        userId
      }).then((bookedEvent) => {
        res.status(201).send({
          message: 'Event booked Successfully',
          bookedEvent,
        });
      }).catch(error => res.status(500).send({
        message: error.message,
      }));
    }).catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });


  }




}





