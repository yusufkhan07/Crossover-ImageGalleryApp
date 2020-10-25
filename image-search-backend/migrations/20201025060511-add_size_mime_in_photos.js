'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('photos', 'size', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })

    queryInterface.addColumn('photos', 'mimetype', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('photos', 'size')
    queryInterface.removeColumn('photos', 'mimetype')
  }
};
