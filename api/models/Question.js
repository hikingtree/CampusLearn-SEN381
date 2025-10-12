const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Question = sequelize.define('Question', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
content: {
    type: DataTypes.TEXT,
    allowNull: false,
},
isAnonymous: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
topicId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: 'topics',
    key: 'id',
    },
    onDelete: 'CASCADE',
},
askedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: 'users',
    key: 'id',
    },
    onDelete: 'SET NULL',
},
}, {
tableName: 'questions',
timestamps: false,
});

// Instance method to add a response
Question.prototype.addResponse = async function(respondedBy, content) {
const Response = require('./Response');
return await Response.create({
    questionId: this.id,
    respondedBy,
    content,
});
};

// Instance method to escalate to tutor (creates a private thread)
Question.prototype.escalateToTutor = async function() {
const PrivateThread = require('./PrivateThread');
const TutorAssignment = require('./TutorAssignment');
const User = require('./User');

  // Find a tutor assigned to this question's topic module
const tutorAssignment = await TutorAssignment.findOne({
    where: { moduleId: this.topicId },
    include: [{ model: User, as: 'tutorUser' }]
});

if (!tutorAssignment || !tutorAssignment.tutorUser) {
    throw new Error('No tutor available for this topic');
}

const tutor = tutorAssignment.tutorUser;

  // Create a private thread between the student and the tutor
return await PrivateThread.create({
    studentUserId: this.askedBy,
    tutorUserId: tutor.id,
    topicId: this.topicId,
});
};

module.exports = Question;
