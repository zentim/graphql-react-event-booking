const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: user.bind(this, event.creator) };
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event.date).toISOString(),
          creator: user.bind(this, event.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          user: user.bind(this, booking.user),
          event: singleEvent.bind(this, booking.event),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
      const creator = await User.findById("5cdbe3e51361ad1a7ca194e5");

      if (!creator) {
        throw new Error("User not found.");
      }

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5cdbe3e51361ad1a7ca194e5"
      });

      const result = await event.save();

      creator.createdEvents.push(event);
      await creator.save();

      return {
        ...result._doc,
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, result.creator)
      };
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    const user = await User.findOne({ email: args.userInput.email });

    if (user) {
      throw new Error("User exists already.");
    }

    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const newUser = new User({
      email: args.userInput.email,
      password: hashedPassword
    });
    const result = await newUser.save();

    return { ...result._doc, password: null };
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5cdbe3e51361ad1a7ca194e5",
      event: fetchedEvent
    });
    const result = await booking.save();
    return {
      ...result._doc,
      user: user.bind(this, booking.user),
      event: singleEvent.bind(this, booking.event),
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString()
    };
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");

      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event.creator)
      };
      console.log(event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
