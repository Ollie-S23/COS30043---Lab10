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
        lookupRecord: function() {
            this.lookupError = '';
            this.currentRecord = null;
            this.editMessage = '';
            this.deleteMessage = '';
            var self = this;
            var readSQLApiURL = `${API_URL}/dest_id/${this.lookupId}`;
            fetch(readSQLApiURL)
                .then(response => { return response.json(); })
                .then(data => {
                    if (data.length === 0) {
                        self.lookupError = `No record found with ID ${self.lookupId}.`;
                    } else {
                        self.currentRecord = data[0];
                        self.editValue = '';
                    }
                })
                .catch(error => { self.lookupError = 'Error fetching record: ' + error; });
        },

        editRecord: function() {
            this.editMessage = '';
            var self = this;
            var putSQLApiURL = `${API_URL}/dest_id/${this.currentRecord.dest_id}`;
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({ [this.editField]: this.editValue }),
            };
            fetch(putSQLApiURL, requestOptions)
                .then(response => { return response.text(); })
                .then(affected => {
                    if (Number(affected) > 0) {
                        self.editSuccess = true;
                        self.editMessage = 'Record updated successfully.';
                        self.currentRecord[self.editField] = self.editValue;
                        self.editValue = '';
                    } else {
                        self.editSuccess = false;
                        self.editMessage = 'No rows were updated.';
                    }
                })
                .catch(error => {
                    self.editSuccess = false;
                    self.editMessage = 'Error updating record: ' + error;
                });
        },

        deleteRecord: function() {
            if (!confirm(`Delete "${this.currentRecord.name}" (ID ${this.currentRecord.dest_id})?`)) return;
            this.deleteMessage = '';
            var self = this;
            var delSQLApiURL = `${API_URL}/dest_id/${this.currentRecord.dest_id}`;
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch(delSQLApiURL, requestOptions)
                .then(response => { return response.text(); })
                .then(affected => {
                    if (Number(affected) > 0) {
                        self.deleteSuccess = true;
                        self.deleteMessage = `Record ID ${self.currentRecord.dest_id} deleted.`;
                        self.currentRecord = null;
                    } else {
                        self.deleteSuccess = false;
                        self.deleteMessage = 'No rows were deleted.';
                    }
                })
                .catch(error => {
                    self.deleteSuccess = false;
                    self.deleteMessage = 'Error deleting record: ' + error;
                });
        },

        createRecord: function() {
            this.createMessage = '';
            const { dest_id, name, country, category, description, rating } = this.newRecord;
            if (!dest_id || !name || !country || !category || !description || !rating) {
                this.createSuccess = false;
                this.createMessage = 'Please fill in all fields including ID.';
                return;
            }
            var self = this;
            var postSQLApiURL = API_URL;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(this.newRecord),
            };
            fetch(postSQLApiURL, requestOptions)
                .then(response => { return response.text(); })
                .then(body => {
                    if (body.startsWith('ERROR:')) {
                        self.createSuccess = false;
                        self.createMessage = `Server error: ${body}`;
                    } else if (body.trim() !== '') {
                        self.createSuccess = true;
                        self.createMessage = `New destination created with ID ${self.newRecord.dest_id}.`;
                        self.newRecord = { dest_id: '', name: '', country: '', category: '', description: '', rating: '' };
                    } else {
                        self.createSuccess = false;
                        self.createMessage = 'Failed to create record — check that the ID is unique and all fields are valid.';
                    }
                })
                .catch(error => {
                    self.createSuccess = false;
                    self.createMessage = 'Error creating record: ' + error;
                });
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
