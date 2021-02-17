const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Event } = require("../db/models");


// EVENTS LIST
router.get("/events", async (req, res) => {
    const dateMin = req.body.startDate;
    try {
        const events = await Event.findAll({
            // where: { $or: [{startDate: {$gt: {dateMin}}}, {}] },
            order: [["startDate", "ASC"]],
            attributes: ["id", "name", "image"]
        });
        res.json(events);
    } catch(error) {
      res.status(500).json({message: error.message});
    }
});

// EVENTS BOOKED
router.get("/events/fully-booked", async (req, res) => {
    try {
        const bookedEvents = await Event.findAll({ where: {
            bookedSeats: {$and: sequelize.col("numOfSeats")}
        }});
        res.json(bookedEvents);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
});

// EVENT DETAIL
router.get("/events/:eventId", async (req, res) => {
    try {
      const foundEvent = await Event.findByPk(req.params.eventId);
      if(foundEvent){
        res.json(foundEvent);
      }else{
        res.status(404).json({message: "Event not found"});
      }
    } catch(error) {
      res.status(500).json({message: error.message});
    }
});

// EVENT CREATE
router.post("/events", async (req, res) => {
    const events = req.body;
    try {
        if(Array.isArray(events)) {
            const newEvents = await Event.bulkCreate(events);
            res.status(201).json(newEvents);
        }else{
            const newEvent = await Event.create(events);
            res.status(201).json(newEvent);
        }
      
    } catch(error) {
      res.status(500).json({message: error.message});
    }
});

// EVENT UPDATE
router.post("/events/:eventId", async (req, res) => {
    try {
      const foundEvent = await Event.findByPk(req.params.eventId);
      if(foundEvent){
        await foundEvent.update(req.body);
        res.status(204).end();
      }else{
        res.status(404).json({message: "Event not found"});
      }
    } catch(error) {
      res.status(500).json({message: error.message});
    }
});

// EVENT DELETE
router.delete("/events", async (req, res) => {
    try {
        if(Array.isArray(ids)) {
            const ids = req.body;
            const toDelete = await Event.findAll({where: {id: ids} });
            // toDelete.forEach(async (event) => {
            //     await event.destroy();
            // });
            await toDelete.destroy({ where: {} });
        }else{
            const foundEvent = await Event.findByPk(ids.id);
            if(foundEvent){
                await foundEvent.destroy();  
                res.status(204).end();
            }else{
                res.status(404).json({message: "Event not found"});
            }
        }
    } catch(error) {
      res.status(500).json({message: error.message});
    }
});

// PAGINATION 
router.get("/events/some", async (req, res) => {
    const offsetValue = req.body.offset;
    const limitValue = req.body.limit;
    try {
        const foundEvents = await Event.findAll({ offset: offsetValue, limit: limitValue});
        res.json(foundEvents);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
});

module.exports = router;