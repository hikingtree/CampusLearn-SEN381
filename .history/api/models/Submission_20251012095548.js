import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; 

const Submission = sequelize.define("Submission", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    answers: {
        type: DataTypes.JSON, 
        allowNull: false
    },
    submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: false, 
});


Submission.prototype.gradeWith = function(rubric) {
    return this.grade;
};

export default Submission;
