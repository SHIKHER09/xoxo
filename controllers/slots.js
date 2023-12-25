
import Admin from "../models/admin.js"

export const createSlots = async (req, res, next) => {
  try {
    const { adminEmail, date, start_time, end_time, duration } = req.body;

    const admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const currentDate = new Date(date);
    const today = new Date();

    if (currentDate <= today) {
      return res.status(400).json({ message: 'Cannot create slots for past or today\'s date' });
    }

    const startTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      start_time.split(':')[0],
      start_time.split(':')[1],
    );

    const endTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      end_time.split(':')[0],
      end_time.split(':')[1],
    );

    if (endTime <= startTime) {
      return res.status(400).json({ message: 'End time cannot be before or equal to start time' });
    }

    const durationInMilliseconds = duration * 60 * 1000;

    const slotsByDate = {};

    for (let i = 0; startTime.getTime() + i * durationInMilliseconds < endTime.getTime(); i++) {
      const slotStartTime = new Date(startTime.getTime() + i * durationInMilliseconds);
      const slotEndTime = new Date(slotStartTime.getTime() + durationInMilliseconds);

      const slotDateKey = date;

      if (!slotsByDate[slotDateKey]) {
        slotsByDate[slotDateKey] = [];
      }

      slotsByDate[slotDateKey].push({
        time: slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        availability: true,
      });
    }

    for (const slotDateKey in slotsByDate) {
      const existingSlot = admin.slots.find((slot) => slot.date === slotDateKey);

      if (existingSlot) {
        existingSlot.slots = slotsByDate[slotDateKey];
      } else {
        admin.slots.push({
          date: slotDateKey,
          slots: slotsByDate[slotDateKey],
        });
      }
    }

    await admin.save();

    res.status(201).json({ message: 'Slots created successfully', slots: slotsByDate });
  } catch (error) {
    next(error);
  }
};


export const booking = async (req, res) => {
  try {
    const requestedDateString = req.params.date;
    const requestedTime = req.params.time;

    const requestedDate = new Date(requestedDateString);
    console.log(requestedDate.getTime());
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    const adim = await Admin.findOne({ email: "admin@gmail.com" });

    if (adim && adim.slots && Array.isArray(adim.slots)) {
      adim.slots.forEach(function (slot) {
        if (slot.date.toISOString() === requestedDate.toISOString()) {
          console.log("slot")
          slot.slots.forEach(async function (startime) {
            console.log(startime.time)
            if (startime.time === requestedTime) {
              console.log("first");
              startime.availability = false;

              try {
                await adim.save();
                res.json({ message: 'Slot booked successfully', bookedSlot: { date: requestedDate, time: requestedTime } });
            } catch (error) {
                console.error("Error saving data:", error);
                res.status(500).json({ message: 'Error booking slot' });
            }
            }
          });
        }
      });
    } else {
      console.log("Invalid or missing data");
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export const getSlots = async (req, res) => {
  try {
    const requestedDateString = req.params.id;

    console.log('Requested Date String:', requestedDateString);

    const requestedDate = new Date(requestedDateString);
    console.log('Parsed Date:', requestedDate);

    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    const currentDate = new Date();
    console.log("fgh"+requestedDate)
    if (requestedDate < currentDate) {
      return res.status(400).json({ message: 'Cannot access slots for past dates.' });
    }

    const admin = await Admin.findOne({
      'slots.date': requestedDate,
    });

    if (!admin) {
      return res.status(404).json({ message: 'No slots found for the specified date.' });
    }

    const slotsForRequestedDate = admin.slots.find(slot => slot.date.getTime() === requestedDate.getTime());

    if (!slotsForRequestedDate) {
      return res.status(404).json({ message: 'No slots found for the specified date.' });
    }

    const currentDay = currentDate.toISOString().slice(0, 10); 

    let availableSlots = slotsForRequestedDate.slots
      .filter(slot => slot.availability);

    if (currentDay === requestedDateString) {
      console.log("first")
      availableSlots = availableSlots.filter(slot => {
        const slotStartTime = slot.time.format('HH:mm');
        console.log("hii " + slotStartTime)
        return slotStartTime >= currentDate || slotStartTime.toISOString().slice(11, 16) === currentDate.toISOString().slice(11, 16); // Check for the same time too
      });
    }

    availableSlots = availableSlots.map(slot => slot.time);

    res.json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
