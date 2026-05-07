<script>
const API_URL = 'https://mercury.swin.edu.au/cos30043/s105912692/Lab10/apis.php'

export default {
    name: 'InterfaceView',
    data() {
        return {
            lookupId: '',
            currentRecord: null,
            lookupError: '',
            editField: 'name',
            editValue: '',
            editMessage: '',
            editSuccess: false,
            deleteMessage: '',
            deleteSuccess: false,
            newRecord: { dest_id: '', name: '', country: '', category: '', description: '', rating: '' },
            createMessage: '',
            createSuccess: false,
        };
    },
    methods: {
        async lookupRecord() {
            this.lookupError = '';
            this.currentRecord = null;
            this.editMessage = '';
            this.deleteMessage = '';
            try {
                const res = await fetch(`${API_URL}/dest_id/${this.lookupId}`);
                const data = await res.json();
                if (data.length === 0) {
                    this.lookupError = `No record found with ID ${this.lookupId}.`;
                } else {
                    this.currentRecord = data[0];
                    this.editValue = '';
                }
            } catch (e) {
                this.lookupError = 'Error fetching record: ' + e.message;
            }
        },

        async editRecord() {
            this.editMessage = '';
            try {
                const res = await fetch(`${API_URL}/dest_id/${this.currentRecord.dest_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({ [this.editField]: this.editValue }),
                });
                const affected = await res.text();
                if (Number(affected) > 0) {
                    this.editSuccess = true;
                    this.editMessage = 'Record updated successfully.';
                    this.currentRecord[this.editField] = this.editValue;
                    this.editValue = '';
                } else {
                    this.editSuccess = false;
                    this.editMessage = 'No rows were updated.';
                }
            } catch (e) {
                this.editSuccess = false;
                this.editMessage = 'Error updating record: ' + e.message;
            }
        },

        async deleteRecord() {
            if (!confirm(`Delete "${this.currentRecord.name}" (ID ${this.currentRecord.dest_id})?`)) return;
            this.deleteMessage = '';
            try {
                const res = await fetch(`${API_URL}/dest_id/${this.currentRecord.dest_id}`, {
                    method: 'DELETE',
                });
                const affected = await res.text();
                if (Number(affected) > 0) {
                    this.deleteSuccess = true;
                    this.deleteMessage = `Record ID ${this.currentRecord.dest_id} deleted.`;
                    this.currentRecord = null;
                } else {
                    this.deleteSuccess = false;
                    this.deleteMessage = 'No rows were deleted.';
                }
            } catch (e) {
                this.deleteSuccess = false;
                this.deleteMessage = 'Error deleting record: ' + e.message;
            }
        },

        async createRecord() {
            this.createMessage = '';
            const { dest_id, name, country, category, description, rating } = this.newRecord;
            if (!dest_id || !name || !country || !category || !description || !rating) {
                this.createSuccess = false;
                this.createMessage = 'Please fill in all fields including ID.';
                return;
            }
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(this.newRecord),
                });
                const body = await res.text();
                if (body.startsWith('ERROR:')) {
                    this.createSuccess = false;
                    this.createMessage = `Server error: ${body}`;
                } else if (body.trim() !== '') {
                    this.createSuccess = true;
                    this.createMessage = `New destination created with ID ${this.newRecord.dest_id}.`;
                    this.newRecord = { dest_id: '', name: '', country: '', category: '', description: '', rating: '' };
                } else {
                    this.createSuccess = false;
                    this.createMessage = 'Failed to create record — check that the ID is unique and all fields are valid.';
                }
            } catch (e) {
                this.createSuccess = false;
                this.createMessage = 'Error creating record: ' + e.message;
            }
        },
    },
};
</script>

<template>
    <div class="container">
        <h1 class="col-12 d-flex justify-content-center">INTERFACE</h1>
        <fieldset class="mb-4">
            <legend>Lookup Record</legend>
            <div class="input-group mb-3">
                <input type="number" class="form-control" id="id_input" v-model="lookupId" placeholder="Enter destination ID..." min="1"/>
                <button class="btn btn-outline-secondary" @click="lookupRecord" :disabled="!lookupId">Lookup</button>
            </div>
            <div v-if="lookupError" class="alert alert-danger">{{ lookupError }}</div>
        </fieldset>

        <div v-if="currentRecord" class="table-responsive mb-4">
            <table class="table table-striped table-hover">
                <caption>Current Record</caption>
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ currentRecord.dest_id }}</td>
                        <td>{{ currentRecord.name }}</td>
                        <td>{{ currentRecord.country }}</td>
                        <td>{{ currentRecord.category }}</td>
                        <td>{{ currentRecord.description }}</td>
                        <td>{{ currentRecord.rating }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <fieldset v-if="currentRecord" class="mb-4">
            <legend>Edit Field</legend>
            <div class="row g-3 align-items-end mb-2">
                <div class="col-auto">
                    <label for="editField" class="form-label">Field</label>
                    <select class="form-select" id="editField" v-model="editField">
                        <option value="name">Name</option>
                        <option value="country">Country</option>
                        <option value="category">Category</option>
                        <option value="description">Description</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
                <div class="col">
                    <label for="editValue" class="form-label">New value</label>
                    <input type="text" class="form-control" id="editValue" v-model="editValue" placeholder="Enter new value..."/>
                </div>
                <div class="col-auto">
                    <button class="btn btn-outline-secondary" @click="editRecord" :disabled="!editValue">Update</button>
                </div>
            </div>
            <div v-if="editMessage" class="alert" :class="editSuccess ? 'alert-success' : 'alert-danger'">{{ editMessage }}</div>
        </fieldset>

        <fieldset v-if="currentRecord" class="mb-4">
            <legend>Delete Record</legend>
            <button class="btn btn-outline-danger" @click="deleteRecord">Delete ID {{ currentRecord.dest_id }}</button>
            <div v-if="deleteMessage" class="alert mt-2" :class="deleteSuccess ? 'alert-success' : 'alert-danger'">{{ deleteMessage }}</div>
        </fieldset>

        <fieldset class="mb-4">
            <legend>Create New Destination</legend>
            <form @submit.prevent="createRecord" novalidate>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label for="new_dest_id" class="form-label">ID</label>
                        <input type="number" class="form-control" id="new_dest_id" v-model="newRecord.dest_id" placeholder="e.g. 16" min="1" required />
                    </div>
                    <div class="col-md-6">
                        <label for="new_name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="new_name" v-model="newRecord.name" placeholder="Name..." />
                    </div>
                    <div class="col-md-6">
                        <label for="new_country" class="form-label">Country</label>
                        <input type="text" class="form-control" id="new_country" v-model="newRecord.country" placeholder="Country..." />
                    </div>
                    <div class="col-md-6">
                        <label for="new_category" class="form-label">Category</label>
                        <select class="form-select" id="new_category" v-model="newRecord.category">
                            <option value="">Select category…</option>
                            <option value="Ocean">Ocean</option>
                            <option value="Mountain">Mountain</option>
                            <option value="Beach">Beach</option>
                            <option value="City">City</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="new_rating" class="form-label">Rating (0–5)</label>
                        <input type="number" class="form-control" id="new_rating" v-model="newRecord.rating" min="0" max="5" step="0.1" placeholder="e.g. 4.7" />
                    </div>
                    <div class="col-12">
                        <label for="new_description" class="form-label">Description</label>
                        <textarea class="form-control" id="new_description" v-model="newRecord.description" rows="3" placeholder="Description..."></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-outline-secondary">Create</button>
                <div v-if="createMessage" class="alert mt-3" :class="createSuccess ? 'alert-success' : 'alert-danger'">{{ createMessage }}</div>
            </form>
        </fieldset>
    </div>
</template>

<style scoped>
caption {
    caption-side: top;
}
</style>
