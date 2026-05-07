<script>
import Paginate from 'vuejs-paginate-next';

export default {
    name: 'page',
    components: { Paginate },
    data() {
        return {
            units: [],
            query: '',
            perPage: 5,
            currentPage: 1
        };
    },
    computed: {
        filteredUnits: function() {
            if (!this.query) return this.units;
            const q = this.query.toLowerCase();
            return this.units.filter(u =>
                u.name.toLowerCase().includes(q) ||
                u.country.toLowerCase().includes(q) ||
                u.category.toLowerCase().includes(q) ||
                u.description.toLowerCase().includes(q)
            );
        },
        getPageCount: function() {
            if (this.perPage === 'all') return 1;
            return Math.ceil(this.filteredUnits.length / parseInt(this.perPage));
        },
        getItems: function() {
            if (this.perPage === 'all') return this.filteredUnits;
            let current = this.currentPage * parseInt(this.perPage);
            let start = current - parseInt(this.perPage);
            return this.filteredUnits.slice(start, current);
        }
    },
    created() {
        var self = this;
        var readSQLApiURL = 'https://mercury.swin.edu.au/cos30043/s105912692/Lab10/apis.php';
        fetch(readSQLApiURL)
            .then(response => { return response.json(); })
            .then(data => { self.units = data; })
            .catch(error => { console.error('Error:', error); });
    },
    watch: {
        query: function() {
            this.currentPage = 1;
        },
        perPage: function() {
            this.currentPage = 1;
        }
    },
    methods: {
        clickCallback: function(pageNum) {
            this.currentPage = Number(pageNum);
        }
    }
};
</script>

<template>
    <div class="container">
        <h1 class="col-12 d-flex justify-content-center">TABLE</h1>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Search..." v-model="query">
        </div>
        <div class="mb-3">
            <label for="rowsSelect" class="form-label me-2">Number of rows:</label>
            <select id="rowsSelect" class="form-select d-inline-block w-auto" v-model="perPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="all">All</option>
            </select>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <caption>Units</caption>
                <thead class="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in getItems" :key="unit.dest_id">
                        <td>{{ unit.name }}</td>
                        <td>{{ unit.country }}</td>
                        <td>{{ unit.category }}</td>
                        <td>{{ unit.description }}</td>
                        <td>{{ unit.rating }}</td>
                    </tr>
                    <tr v-if="getItems.length === 0">
                        <td colspan="5" class="text-center text-muted">No destinations found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Paginate
            v-if="getPageCount > 1"
            :page-count="getPageCount"
            :page-range="3"
            :margin-pages="2"
            :click-handler="clickCallback"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-class="'page-item'"
            :prev-link-class="'page-link'"
            :next-class="'page-item'"
            :next-link-class="'page-link'"
            :force-page="currentPage"
        />
    </div>
</template>

<style scoped>
caption {
    caption-side: top;
}
</style>
