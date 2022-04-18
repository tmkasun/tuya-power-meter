import { Injectable } from "@nestjs/common";
import { openDB, search, searchByMonthRange } from "src/utils/database";
import logger from "src/utils/logger";
import { KnnectTableTypes } from "src/utils/tableNames";
import { CreateCatDto } from "./dto/create-cat.dto";
import { Cat } from "./entities/cat.entity";

@Injectable()
export class EnergyService {
  private readonly cats: Cat[] = [];
  db: Promise<unknown>;
  constructor() {
    logger.info("Initializing SQLite3");
    this.db = openDB();
  }
  create(cat: CreateCatDto): Cat {
    this.cats.push(cat);
    return cat;
  }

  findOne(id: number): Cat {
    return this.cats[id];
  }

  getAll(
    offset,
    limit,
    orderBy,
    order,
    start,
    end,
    tableType = KnnectTableTypes.POWER
  ): Promise<any> {
    let results;
    if (start) {
      results = searchByMonthRange(
        offset,
        limit,
        orderBy,
        order,
        start,
        end,
        tableType
      );
    } else {
      results = search(offset, limit, orderBy, order, tableType);
    }
    return results;
  }

  getAllVoltage(offset, limit, orderBy, order, start, end): Promise<any> {
    return this.getAll(
      offset,
      limit,
      orderBy,
      order,
      start,
      end,
      KnnectTableTypes.VOLTAGE
    );
  }

  getAllTotalPower(offset, limit, orderBy, order, start, end): Promise<any> {
    return this.getAll(
      offset,
      limit,
      orderBy,
      order,
      start,
      end,
      KnnectTableTypes.TOTAL
    );
  }
}
