const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Assessment = require('./Assessment');

const AssessmentQuestion = sequelize.define('AssessmentQuestion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  assessmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Assessment,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  maxMarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'assessment_questions',
  timestamps: false,
});

// Associations
AssessmentQuestion.associate = (models) => {
AssessmentQuestion.belongsTo(models.Assessment, { foreignKey: 'assessmentId', as: 'assessment' });
};

module.exports = AssessmentQuestion;
