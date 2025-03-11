const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('bubblr', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});

// User model
const User = sequelize.define('User', {
  googleId: { type: DataTypes.STRING, allowNull: false, unique: true },
  nameFirst: DataTypes.STRING,
  nameLast: DataTypes.STRING,
  email: DataTypes.STRING,
});

// User friends model
const UserFriends = sequelize.define('UserFriends', {
  friend1Id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  friend2Id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

// Event model
const Event = sequelize.define('Event', {
  name: { type: DataTypes.STRING, allowNull: false },
});

// Bar model
const Bar = sequelize.define('Bar', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zipcode: DataTypes.STRING,
});

const customDrinks = sequelize.define('customDrinks', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    }
  },
  drinkName: {
    type: DataTypes.STRING,
  },
  drinkCategory: {
    type: DataTypes.STRING,
  },
  alcoholicDrink: {
    type: DataTypes.STRING,
  },
  drinkGlass: {
    type: DataTypes.STRING,
  },
  drinkInstructions: {
    type: DataTypes.TEXT,
  },
  drinkIngredients: {
    type: DataTypes.STRING,
  },
  drinkMeasurements: {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue("drinkMeasurements", JSON.stringify(val ?? ""));
    },
  },
})
// Custom drinks model
const customDrinks = sequelize.define('customDrinks', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  drinkName: {
    type: DataTypes.STRING,
  },
  drinkCategory: {
    type: DataTypes.STRING,
  },
  alcoholicDrink: {
    type: DataTypes.STRING,
  },
  drinkGlass: {
    type: DataTypes.STRING,
  },
  drinkInstructions: {
    type: DataTypes.TEXT,
  },
  drinkIngredients: {
    type: DataTypes.STRING,
  },
  drinkMeasurements: {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue('drinkMeasurements', JSON.stringify(val ?? ''));
    },
  },
});

customDrinks.sync()
  .catch((err) => console.error('Failed syncing customDrinks: ', err));

const estDrinks = sequelize.define('estDrinks', {
  drinkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  drinkName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  drinkCategory: {
    type: DataTypes.STRING,
  },
  alcoholicDrink: {
    type: DataTypes.STRING,
  },
  drinkGlass: {
    type: DataTypes.STRING,
  },
  drinkInstructions: {
    type: DataTypes.TEXT,
  },
  drinkIngredients: {
    type: DataTypes.JSON,
  },
  drinkImage: {
    type: DataTypes.STRING
  }
})
// estDrinks model
const estDrinks = sequelize.define('estDrinks', {
  drinkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  drinkName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  drinkCategory: {
    type: DataTypes.STRING,
  },
  alcoholicDrink: {
    type: DataTypes.STRING,
  },
  drinkGlass: {
    type: DataTypes.STRING,
  },
  drinkInstructions: {
    type: DataTypes.TEXT,
  },
  drinkIngredients: {
    type: DataTypes.JSON,
  },
  drinkImage: {
    type: DataTypes.STRING,
  },
});

estDrinks.sync()
  .catch((err) => console.error('Failed syncing estDrinks: ', err));

// Comment model
const Comment = sequelize.define('Comment', {
  drinkId: {
    type: DataTypes.INTEGER,
    references: {
      model: estDrinks,
      key: 'drinkId',
    },
  },
  comment: {
    type: DataTypes.TEXT,
  },
});

// Rating model
const Rating = sequelize.define('Rating', {
  drinkId: {
    type: DataTypes.INTEGER,
    references: {
      model: estDrinks,
      key: 'drinkId',
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5,
    },
  },
});

// Match Game model
const MatchGame = sequelize.define('MatchGame', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  drinkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING, // Stores user-uploaded image (Cloudinary URL)
  },
});

// Achievement model
const Achievements = sequelize.define('Achievements', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  achievementType: {
    type: DataTypes.STRING,
  },
  badgeImage: {
    type: DataTypes.STRING,
  },
});

// User Achievements model
const UserAchievements = sequelize.define('UserAchievements', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  achievementId: {
    type: DataTypes.INTEGER,
    references: {
      model: Achievements,
      key: 'id',
    },
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Model associations
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Event.belongsToMany(Bar, { through: 'EventBars' });
Bar.belongsToMany(Event, { through: 'EventBars' });

User.belongsToMany(Achievements, { through: UserAchievements });
Achievements.belongsToMany(User, { through: UserAchievements });

// sequelize.sync({ alter: true })
//   .then(() => console.log('synced'))
//   .catch((err) => console.error('Error syncing', err));

// Sync models
User.sync().catch((err) => console.error(err));
UserFriends.sync().catch((err) => console.error('Failed syncing UserFriends: ', err));
customDrinks.sync().catch((err) => console.error('Failed syncing customDrinks: ', err));
estDrinks.sync().catch((err) => console.error('Failed syncing estDrinks: ', err));
Comment.sync().catch((err) => console.error('Failed syncing Comment:', err));
Rating.sync().catch((err) => console.error('Failed syncing Rating:', err));

MatchGame.sync().catch((err) => console.error('Failed syncing MatchGame:', err));
Achievements.sync().catch((err) => console.error('Failed syncing Achievements:', err));
UserAchievements.sync().catch((err) => console.error('Failed syncing UserAchievements:', err));


module.exports = {
  User,
  Event,
  Bar,
  UserFriends,
  customDrinks,
  estDrinks,
  Comment,
  Rating,
  MatchGame,
  Achievements,
  UserAchievements,
};
