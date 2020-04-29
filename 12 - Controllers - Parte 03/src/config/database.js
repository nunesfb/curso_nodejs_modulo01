module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: '1234',
  database: 'ride_app',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
