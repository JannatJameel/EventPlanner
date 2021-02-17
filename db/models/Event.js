module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        organizer: { 
            type: DataTypes.STRING(20), 
            unique: true, 
        },
        name: { 
            type: DataTypes.STRING, 
            validate: {notContains: "event"} 
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {isEmail: true} 
        },
        numOfSeats: { 
            type: DataTypes.INTEGER, 
            validate: {min: 0} 
        },
        bookedSeats: { 
            type: DataTypes.INTEGER, 
            validate: {max: function(value) {
                if(value > this.numOfSeats) {
                    throw new Error("Booked seats has to be less than the number of seats")
                }
            }} 
        },
        startDate: { 
            type: DataTypes.DATEONLY, 
            allowNull: true,
            validate: {
                checkNull(value) {
                    if(value === null && this.endDate !== null){
                        throw new Error("Start date can't be null unless end date is");
                    }
                }
            }
        },
        endDate: { 
            type: DataTypes.DATEONLY, 
            allowNull: true,
            validate: {
                isBefore: function(value) {
                    if(value < this.startDate) {
                        throw new Error("End date has to be after start date");
                    }
                },
                checkNull(value) {
                    if(value === null && this.startDate !== null){
                        throw new Error("End date can't be null unless start date is");
                    }
                }
            }
        },
        image: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {isUrl: true} 
        }
    },
        { timestamps: false }
    );

    return Event;
};