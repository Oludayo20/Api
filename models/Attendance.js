const { model, Schema } = require('mongoose');

const nodeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    default: null
  },
  levelOne: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Node'
    }
  ],
  levelTwo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Node'
    }
  ],
  levelThree: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Node'
    }
  ],
  levelFour: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Node'
    }
  ],
  levelFive: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Node'
    }
  ]
});

// Student Schema

const studentSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    matriculationNum: {
      type: String,
      required: true
    },
    secretMsg: {
      type: String,
      required: true
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      default: null
    },
    level: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Department = model('Department', nodeSchema);
const Student = model('Student', studentSchema);

module.exports = {
  Department,
  Student
};
