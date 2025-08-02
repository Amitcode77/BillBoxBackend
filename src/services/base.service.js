class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findAll(filter = {}) {
    return this.model.find(filter);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  // Partial update (PATCH behavior)
  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  // Complete replacement (PUT behavior)
  async replace(id, data) {
    return this.model.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true,
      overwrite: true  // This makes it behave like PUT
    });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseService; 