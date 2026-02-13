export const ValidatePost = (req, res, next) => {
  const { title, image, category_id, description, content, status_id } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required and must be a string." });
  }
  if (!image || typeof image !== "string" || image.trim() === "") {
    return res.status(400).json({ message: "Image is required and must be a string." });
  }
  if (!category_id || isNaN(category_id)) {
    return res.status(400).json({ message: "Category ID is required and must be a number." });
  }
  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ message: "Description is required and must be a string." });
  }
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ message: "Content is required and must be a string." });
  }
  if (!status_id || isNaN(status_id)) {
    return res.status(400).json({ message: "Status ID is required and must be a number." });
  }

  next();
};

export const ValidatePut = (req, res, next) => {
  const { title, image, category_id, description, content, status_id } = req.body;

  // For PUT, we might want to allow partial updates, but currently app.mjs updates everything.
  // So we validate everything for now to match the current implementation.
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Title is required for update." });
  }
  if (!image || typeof image !== "string" || image.trim() === "") {
    return res.status(400).json({ message: "Image is required for update." });
  }
  if (!category_id || isNaN(category_id)) {
    return res.status(400).json({ message: "Category ID is required for update." });
  }
  if (!description || typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ message: "Description is required for update." });
  }
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ message: "Content is required for update." });
  }
  if (!status_id || isNaN(status_id)) {
    return res.status(400).json({ message: "Status ID is required for update." });
  }

  next();
};
