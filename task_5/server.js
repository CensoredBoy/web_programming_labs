import express from 'express';
import cors from 'cors';
import pg from 'pg';

const pool = new pg.Pool({
  user: 'jkoimni',
  password:'qwerty',
  host: 'localhost',
  database: 'cathedra',
  port: 5432
});

const app = express();
app.use(express.json());
app.use(cors());

class WorkerController {
  // Получить список всех клиентов
  async getWorker(req, res) {
    try {
      const worker = await pool.query('SELECT * FROM worker');
      res.json(worker.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching worker' });
    }
  }

  // Добавить нового клиента
  async addWorker(req, res) {
    const { name, surname, lastname, type } = req.body;
    if (!name || !surname || !lastname || !type) {
      return res.status(400).json({ error: 'Name, address, and phone are required' });
    }

    try {
      const newWorker = await pool.query(
        'INSERT INTO worker (name, surname, lastname, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, surname, lastname, type]
      );
      res.status(201).json(newWorker.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding worker' });
    }
  }

  // Обновить существующего клиента
  async updateWorker(req, res) {
    const { id } = req.params;
    const { name, surname, lastname, type } = req.body;
    if (!name || !surname || !lastname || !type) {
      return res.status(400).json({ error: 'Name, lastname, surname, and type are required' });
    }

    const workerId = parseInt(id, 10);
    if (isNaN(workerId)) {
      return res.status(400).json({ error: 'Invalid worker ID' });
    }

    try {
      const updatedWorker = await pool.query(
        'UPDATE worker SET name = $1, surname = $2, lastname = $3, type = $4 WHERE id = $5 RETURNING *',
        [name, surname, lastname, type, workerId]
      );
      if (updatedWorker.rows.length > 0) {
        res.json(updatedWorker.rows[0]);
      } else {
        res.status(404).json({ error: 'Worker not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating worker' });
    }
  }

  // Удалить клиента
  async deleteWorker(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Worker ID' });
    }

    const workerId = parseInt(id, 10);
    console.log(`Deleting Worker with ID: ${workerId}`); // Отладочное сообщение

    try {
      const result = await pool.query('DELETE FROM worker WHERE id = $1', [workerId]);
      if (result.rowCount > 0) {
        console.log(`Worker with ID ${workerId} deleted successfully`); // Отладочное сообщение
        res.json({ message: 'Worker deleted successfully' });
      } else {
        console.log(`Worker with ID ${workerId} not found`); // Отладочное сообщение
        res.status(404).json({ error: 'Worker not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting Worker' });
    }
  }
}

class DisciplineController {
  // Получить список всего транспорта
  async getDiscipline(req, res) {
    try {
      const discipline = await pool.query('SELECT d.id, d.name, w.lastname FROM discipline AS d INNER JOIN worker w ON w.id = d.professor_id');
      res.json(discipline.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching discipline' });
    }
  }

  // Добавить новый транспорт
  async addDiscipline(req, res) {
    const { name, lastname } = req.body;
    if (!name || !lastname) {
      return res.status(400).json({ error: 'Type and cost are required' });
    }

    try {
      let workerId = await pool.query(
          'SELECT id FROM worker WHERE lastname = ($1) LIMIT 1',
          [lastname]
      );
      console.log(workerId.rows[0].id)
      const newDiscipline = await pool.query(
        'INSERT INTO discipline (name, professor_id) VALUES ($1, $2) RETURNING *',
        [name, workerId.rows[0].id]
      );
      res.status(201).json(newDiscipline.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding Discipline' });
    }
  }

  // Обновить существующий транспорт
  async updateDiscipline(req, res) {
    const { id } = req.params;
    const { name, lastname } = req.body;
    if (!name || !lastname) {
      return res.status(400).json({ error: 'Type and cost are required' });
    }

    const disciplineId = parseInt(id, 10);
    if (isNaN(disciplineId)) {
      return res.status(400).json({ error: 'Invalid Discipline ID' });
    }

    try {
       let workerId = await pool.query(
          'SELECT id FROM worker WHERE lastname = ($1) LIMIT 1',
          [lastname]
      );
      console.log(workerId.rows[0].id)
      const updatedDiscipline = await pool.query(
        'UPDATE discipline SET name = $1, professor_id = $3 WHERE id = $2 RETURNING *',
        [name, disciplineId, workerId.rows[0].id]
      );
      if (updatedDiscipline.rows.length > 0) {
        res.json(updatedDiscipline.rows[0]);
      } else {
        res.status(404).json({ error: 'Discipline not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating Discipline' });
    }
  }

  // Удалить транспорт
  async deleteDiscipline(req, res) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Discipline ID' });
    }

    const disciplineId = parseInt(id, 10);
    console.log(`Deleting Discipline with ID: ${disciplineId}`); // Отладочное сообщение

    try {
      const result = await pool.query('DELETE FROM discipline WHERE id = $1', [disciplineId]);
      if (result.rowCount > 0) {
        console.log(`Discipline with ID ${disciplineId} deleted successfully`); // Отладочное сообщение
        res.json({ message: 'Discipline deleted successfully' });
      } else {
        console.log(`Discipline with ID ${disciplineId} not found`); // Отладочное сообщение
        res.status(404).json({ error: 'Discipline not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting Discipline' });
    }
  }
}

const workerController = new WorkerController();
const disciplineController = new DisciplineController();

// Маршруты для методов клиентов
app.get('/worker', (req, res) => workerController.getWorker(req, res));
app.post('/worker', (req, res) => workerController.addWorker(req, res));
app.put('/worker/:id', (req, res) => workerController.updateWorker(req, res));
app.delete('/worker/:id', (req, res) => workerController.deleteWorker(req, res));

// Маршруты для методов транспорта
app.get('/discipline', (req, res) => disciplineController.getDiscipline(req, res));
app.post('/discipline', (req, res) => disciplineController.addDiscipline(req, res));
app.put('/discipline/:id', (req, res) => disciplineController.updateDiscipline(req, res));
app.delete('/discipline/:id', (req, res) => disciplineController.deleteDiscipline(req, res));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});