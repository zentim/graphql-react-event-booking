const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
      const creator = await User.findById("5cdd0e29617ce804c47fa068");

      if (!creator) {
        throw new Error("User not found.");
      }

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5cdd0e29617ce804c47fa068"
      });

      const result = await event.save();

      creator.createdEvents.push(event);
      await creator.save();

      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  }
};
