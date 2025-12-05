import { dbQueries } from "../../utils/db/queries.js";
import { riderApplications } from "./models/index.js";

class RidersService {
  #dbQueries;
  constructor() {
    this.#dbQueries = dbQueries;
  }
  async registerRidersService(value) {
    try {
      const existingRider = await riderApplications.findOne({
        cnic: value.cnic,
      });

      if (existingRider) {
        return {
          error: true,
          status: 400,
          message: "Rider already exists with this email",
        };
      }

      const newRider = new riderApplications(value);
      const savedRider = await newRider.save();

      return {
        error: false,
        status: 201,
        message: "Rider application submitted successfully",
        data: savedRider,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        status: 500,
        message: "Failed to register rider",
      };
    }
  }

  async getRidersService({ limit, page, status }) {
    try {
      const skip = (page - 1) * limit;
      const query = status ? { status } : {};

      const riders = await riderApplications.aggregate([
        this.#dbQueries.paginationQuery(
          query,
          "riderapplications",
          skip,
          limit,
          page
        ),
      ]);

      return {
        error: false,
        status: 200,
        message: "Riders fetched successfully",
        data: riders,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        status: 500,
        message: "Failed to fetch riders",
      };
    }
  }

  async updateRiderStatusService({ id, status }) {
    try {
      const updatedRider = await riderApplications.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRider) {
        return {
          error: true,
          status: 404,
          message: "Rider not found",
        };
      }

      return {
        error: false,
        status: 200,
        message: "Rider status updated successfully",
        data: updatedRider,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        status: 500,
        message: "Failed to update rider status",
      };
    }
  }
}

export const ridersServiceModule = new RidersService();
