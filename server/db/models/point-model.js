import mongoose from "mongoose";
import { PointSchema } from "../schemas/point-schema.js";

const Point = mongoose.model("points", PointSchema);

export class PointModel {
  async findById(pointId) {
    const point = await Point.findOne({ _id: pointId })
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 });
    return point;
  }

  async findAllByUserId(userId) {
    const points = await Point.find({ userObject: userId })
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 });
    return points;
  }

  async findByDeltedAll() {
    const points = await Point.find({}).where("isDeleted").equals(true);
    return points;
  }

  async create(PointInfo) {
    const createdNewPoint = await Point.create(PointInfo);
    return createdNewPoint;
  }

  async findAll() {
    const Points = await Point.find({})
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 });
    return Points;
  }
  async findByIsNotCharged(query, page, limit) {
    const points = await Point.find(query)
      .where("isCharged")
      .equalse(false)
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return points;
  }

  async findByIsCharged(query, page, limit) {
    const points = await Point.find(query)
      .where("isCharged")
      .equalse(true)
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return points;
  }
  async update({ PointId, update }) {
    const filter = { _id: PointId };
    const option = { returnOriginal: false };

    const updatedPoint = await Point.findOneAndUpdate(filter, update, option)
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      });
    return updatedPoint;
  }

  async findByPagination(query, page, limit) {
    const points = await Point.find(query)
      .where("isDeleted")
      .equals(false)
      .select("-isDeleted")
      .populate({
        path: "userObject",
        select: { password: 0, isDeleted: 0 },
      })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return points;
  }
  async deleteById(pointId) {
    const filter = { _id: pointId };
    const option = { returnOriginal: false };
    const point = await Point.findOneAndUpdate(
      filter,
      { isDeleted: true },
      option
    );
    return point;
  }
}

const pointModel = new PointModel();

export { pointModel };
