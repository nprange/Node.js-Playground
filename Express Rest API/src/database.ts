import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);
type DynamicDatabase = Record<string, Array<Record<string, unknown>>>;

export class Database {
	#database: DynamicDatabase = {};

	constructor() {
		fs.readFile(databasePath, "utf8")
			.then((data) => {
				this.#database = JSON.parse(data);
			})
			.catch(() => {
				this.#persist();
			});
	}

	#persist() {
		fs.writeFile(databasePath, JSON.stringify(this.#database));
	}

	// { name: "John", email: "john@example.com" }
	// [['name', 'John'], ['email', 'john@example.com']] -> Object.entries(object)

	select(table: string, search?: Record<string, unknown>) {
		let data = this.#database[table] ?? [];

		if (search) {
			data = data.filter((row) => {
				return Object.entries(search).some(([key, value]) => {
					return String(row[key])
						.toLowerCase()
						.includes(String(value).toLowerCase());
				});
			});
		}
		return data;
	}

	selectById(table: string, id: string) {
		const tableData = this.#database[table] ?? [];
		const rowIndex = tableData.findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			return this.#database[table][rowIndex];
		}

		return {};
	}

	insert(table: string, data: Record<string, unknown>) {
		if (Array.isArray(this.#database[table])) {
			this.#database[table].push(data);
		} else {
			this.#database[table] = [data];
		}

		this.#persist();

		return data;
	}

	update(table: string, id: string, data: Record<string, unknown>) {
		const tableData = this.#database[table] ?? [];
		const rowIndex = tableData.findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			this.#database[table][rowIndex] = { id, ...data };
			this.#persist();
		}
	}

	delete(table: string, id: string) {
		const tableData = this.#database[table] ?? [];
		const rowIndex = tableData.findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1);
			this.#persist();
		}
	}
}
