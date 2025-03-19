const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticate } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message to a chat
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The chat ID
 *               message:
 *                 type: string
 *                 description: The message
 *               mediaUrl:
 *                 type: string
 *                 description: The media URL
 *               messageType:
 *                 type: string
 *                 description: The message type
 *             required:
 *              - chatId
 *              - message
 *              - mediaUrl
 *              - messageType
 *     responses:
 *       201:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The message ID
 *                     chatId:
 *                       type: string
 *                       description: The chat ID
 *                     message:
 *                       type: string
 *                       description: The message
 *                     mediaUrl:
 *                       type: string
 *                       description: The media URL
 *                     messageType:
 *                       type: string
 *                       description: The message type
 *                     createdAt:
 *                       type: string
 *                       description: The message creation date
 *                     updatedAt:
 *                       type: string
 *                       description: The message update date
 *                     sender:
 *                       type: string
 *                       description: The message sender
 *                     deleteMessage:
 *                       type: array
 *                       items:
 *                         type: string
 *                     seen:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             description: The message seen person ID
 *                           seenAt:
 *                             type: string
 *                             description: The message seen date
 *                     reactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             description: The message seen person ID
 *                           reactionType:
 *                             type: string
 *                             description: The message reaction type
 *       400:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   default: false
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/", authenticate, messageController.sendMessage);

/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     summary: Get all messages from a chat
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The message ID
 *                       chatId:
 *                         type: string
 *                         description: The chat ID
 *                       message:
 *                         type: string
 *                         description: The message
 *                       mediaUrl:
 *                         type: string
 *                         description: The media URL
 *                       messageType:
 *                         type: string
 *                         description: The message type
 *                       createdAt:
 *                         type: string
 *                         description: The message creation date
 *                       updatedAt:
 *                         type: string
 *                         description: The message update date
 *                       sender:
 *                         type: string
 *                         description: The message sender
 *                       deleteMessage:
 *                         type: array
 *                         items:
 *                           type: string
 *                       seen:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                               description: The message seen person ID
 *                             seenAt:
 *                               type: string
 *                               description: The message seen date
 *                       reactions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                               description: The message seen person ID
 *                             reactionType:
 *                               type: string
 *                               description: The message reaction type
 *       400:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   default: false
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/:chatId", authenticate, messageController.getMessages);

/**
 * @swagger
 * /messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The message ID
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   default: false
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.delete("/:messageId", authenticate, messageController.deleteMessage);

/**
 * @swagger
 * /messages/seen-message:
 *   post:
 *     summary: Mark a message as seen
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: The message ID
 *             required:
 *              - messageId
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Error message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                   default: false
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/seen-message", authenticate, messageController.seenMessage);

module.exports = router;
