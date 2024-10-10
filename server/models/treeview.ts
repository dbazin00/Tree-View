import { sq } from "../config/db";
import { DataTypes, Model } from "sequelize";

export class TreeView extends Model {
  public id!: number;
  public name!: string;
  public parentId!: number | null;
}

TreeView.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "TreeViews",
        key: "id",
      },
    },
  },
  {
    sequelize: sq,
    modelName: "TreeView",
    tableName: "TreeViews",
    timestamps: false,
  }
);

const initializeTree = async () => {
  await sq.sync({ force: true });
  const rootExists = await TreeView.findByPk(1);

  if (!rootExists) {
    await TreeView.create({ name: "Root" });
  }
};

initializeTree();
