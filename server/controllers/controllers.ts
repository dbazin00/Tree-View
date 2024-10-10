import { Request, Response } from "express";
import { TreeView } from "../models/treeview";

export const findAllTreviews = async (_: Request, res: Response) => {
  const treeViews = await TreeView.findAll();
  const resultTreeViews = treeViews.map((el) => ({
    id: el.id,
    text: el.text,
    parent: el.parentId === null ? 0 : el.parentId,
    droppable: treeViews.some((child) => child.parentId === el.id),
  }));
  res.json(resultTreeViews);
};

export const findTreviewById = async (req: Request, res: Response) => {
  const treeView = await TreeView.findByPk(req.params.id);
  if (treeView) {
    res.json(treeView);
  } else {
    res.status(404).send("TreeView not found");
  }
};

export const addNewTreeview = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { text, parentId } = req.body;
  const parent = await TreeView.findByPk(parentId);

  if (!parent) {
    return res.status(400).send("Parent TreeView not found");
  }

  const newTreeView = await TreeView.create({ text, parentId });
  res.status(201).json(newTreeView);
};

export const updateTreeview = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { text } = req.body;
  const treeView = await TreeView.findByPk(req.params.id);

  if (!treeView) {
    return res.status(404).send("TreeView not found");
  }

  treeView.text = text;
  await treeView.save();
  res.json(treeView);
};

export const deleteTreeview = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  if (Number(id) === 1) {
    res.status(422).send("Deletion of root is not allowed");
    return;
  }
  const treeView = await TreeView.findByPk(id);

  if (!treeView) {
    return res.status(404).send("TreeView not found");
  }

  await deleteTreeviewAndChildren(Number(req.params.id));
  res.status(204).send();
};

const deleteTreeviewAndChildren = async (treeViewId: number) => {
  const children = await TreeView.findAll({ where: { parentId: treeViewId } });
  for (let child of children) {
    await deleteTreeviewAndChildren(child.id);
  }
  await TreeView.destroy({ where: { id: treeViewId } });
};

export const relocateTreeview = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { newParentId } = req.body;
  const treeView = await TreeView.findByPk(Number(req.params.id));
  const newParent = await TreeView.findByPk(newParentId);

  if (!treeView || !newParent) {
    return res.status(404).send("TreeView or new parent not found");
  }

  treeView.parentId = newParentId;
  await treeView.save();
  res.json(treeView);
};
