// services/therapistService.js

const TherapistDataAccess = require('../dataAccess/therapistDataAccess');

class TherapistService {
    static async registerTherapist(therapistData) {
        return await TherapistDataAccess.addTherapist(therapistData);
    }

    static async loginTherapist(email, password) {
        const therapist = await TherapistDataAccess.getTherapistByEmail(email);
        if (therapist && therapist.password === password) {
            return therapist;
        }
        return null;
    }
}

module.exports = TherapistService;


// const TherapistDataAccess = require('../dataAccess/therapistDataAccess');
// const Therapist = require('../models/therapist');

// class TherapistService {
//   static registerTherapist(email, password, name) {
//     const newTherapist = new Therapist(TherapistDataAccess.getAllTherapists().length + 1, email, password, name);
//     return TherapistDataAccess.addTherapist(newTherapist);
//   }

//   static loginTherapist(email, password) {
//     const therapist = TherapistDataAccess.getTherapistByEmail(email);
//     if (therapist && therapist.password === password) {
//       return therapist;
//     }
//     return null;
//   }
// }

// module.exports = TherapistService;