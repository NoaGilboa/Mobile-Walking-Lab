// dataAccess/therapistDataAccess.js

const Therapist = require('../models/therapist');

class TherapistDataAccess {
    static async addTherapist(therapistData) {
        const therapist = new Therapist(therapistData);
        return await therapist.save();
    }

    static async getTherapistByEmail(email) {
        return await Therapist.findOne({ email });
    }
}

module.exports = TherapistDataAccess;

// let therapists = [];

// class TherapistDataAccess {
//   static getAllTherapists() {
//     return therapists;
//   }

//   static addTherapist(therapist) {
//     therapists.push(therapist);
//     return therapist;
//   }

//   static getTherapistByEmail(email) {
//     return therapists.find((t) => t.email === email);
//   }
// }

// module.exports = TherapistDataAccess;
