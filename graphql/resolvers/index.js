const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

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
}

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
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events
                .map(event => {
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
    createEvent: async args => {
        try {
            const creator = await User.findById('5cdbe3e51361ad1a7ca194e5');

            if (!creator) {
                throw new Error('User not found.');
            }

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5cdbe3e51361ad1a7ca194e5'
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
            throw new Error('User exists already.');
        }

        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const newUser = new User({
            email: args.userInput.email,
            password: hashedPassword
        });
        const result = await newUser.save();

        return { ...result._doc, password: null };
    }
};