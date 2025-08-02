class BaseController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const items = await this.service.findAll();
      res.json(items);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const item = await this.service.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const item = await this.service.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const item = await this.service.delete(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

module.exports = BaseController; 