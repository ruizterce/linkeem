import { Request, Response } from "express";
import { CommentModel } from "../models/CommentModel";
import { body, validationResult } from "express-validator";

export const CommentController = {
  // Create a new comment
  createComment: [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content cannot be empty")
      .isLength({ max: 360 })
      .withMessage("Comment content cannot exceed 360 characters"),

    async (req: Request, res: Response): Promise<Response | void> => {
      const { content, postId } = req.body;
      const currentUserId = req.user?.id;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const newComment = await CommentModel.createComment(
          content,
          postId,
          currentUserId
        );
        return res.status(201).json(newComment);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating comment." });
      }
    },
  ],

  // Delete a comment
  deleteComment: async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const { commentId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Fetch the comment to verify ownership
      const comment = await CommentModel.getCommentById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      if (comment.userId !== currentUserId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this comment." });
      }

      // Delete the comment
      await CommentModel.deleteComment(commentId);
      return res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting comment." });
    }
  },
};
