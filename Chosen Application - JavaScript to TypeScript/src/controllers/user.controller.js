import { Request, Response } from 'express';
import winston from 'winston';
import {transformIdOutgoing} from '../../src/transformIdOutgoing';

/**
 * Async function that saves a user and calls the result on the res object
 *
 * @param  {Object} req the request object, typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
export const save = async (req, res) => {
  const userModel = require('../../src/models/user.model.js');
  try {
    const user = await userModel.save(req.body);
    const transformed = transformIdOutgoing(user);
    res.status(201).json(transformed);
  } catch (error) {
    winston.error(error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Async function that retrieves a user user for an id that is expected in req.params calls the result on the res object
 *
 * Will return 404 if user cannot be found
 *
 * @param  {Object} req the request object, should contain params.id typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
export const get = async (req, res) => {
  // todo : should validate that id actually exists
  winston.info(`Attempting to retrieve user for ${req.params.id}`);
  const userModel = require('../../src/models/user.model.js');
  try {
    const user = await userModel.findByID(req.params.id);
    if (user) {
      const transformed = transformIdOutgoing(user);
      res.status(200).json(transformed);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    winston.error(error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Async function to delete a user by id that is expected in req.params, 204 if successful
 *
 * @param  {Object} req the request object, should contain params.id typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
export const deleteUser = async (req, res) => {
  // todo : should validate that id actually exists
  winston.info(`Attempting to delete user for ${req.params.id}`);
  const userModel = require('../../src/models/user.model.js');
  try {
    const deleted = await userModel.deleteUser(req.params.id);
    if (deleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    winston.error(error);
         res.status(400).json({ error: error.message });
  }
};

/**
 * Async function to put a user by id that is expected in req.params, 200 if already exists and updated
 * 201 if created. Will also return the most up to date version of the document
 *
 * @param  {Object} req the request object, should contain params.id typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
export const put = async (req, res) => {
  // todo : should validate that id actually exists
  winston.info(`Attempting to put user for ${req.params.id}`);

  const userModel = require('../../src/models/user.model.js');
  try {
    if (req.body.id) {
      // todo : should be handled by json schema validation or similar
      throw new Error('cannot have an id in the body of the request, must be the resource locator');
    }
    const updated = await userModel.update(req.params.id, req.body);
    if (updated) {
      winston.info(`Updated ${req.params.id}`);
      const transformed = transformIdOutgoing(updated);
      res.status(200).json(transformed);
    } else {
      winston.info(`Cannot find ${req.params.id}, creating`);
      req.body._id = req.params.id;
      await module.exports.save(req, res);
    }
  } catch (error) {
    winston.error(error);
         res.status(400).json({ error: error.message });
  }
};

/**
 * Async function that retrieves a user user for an id that is expected in req.params calls the result on the res object
 *
 * Will return 404 if user cannot be found
 *
 * @param  {Object} req the request object, should contain params.id typically an express Request
 * @param  {Object} res the response object, typically an express Response
 */
export const list = async (req, res) => {
  // todo : should validate that id actually exists
  winston.info('Attempting to query users for ', req.query);
  winston.info('Attempting to query users with ', req.params);
  const userModel = require('../../src/models/user.model.js');
  try {
    const users = await userModel.where(req.query, req.params.limit, req.params.offset, req.params.sort);
    const transformedUsers = users.map(user => transformIdOutgoing(user));
    res.status(200).json(transformedUsers);
  } catch (error) {
    winston.error(error);
    res.status(400).json({ error: error.message });
  }
};