var eventBus = new Vue();

Vue.component('product', {
    template: `
        <div class="product">
            <div class="product-info">
                <h1>{{ title }}
                    <span v-if="inStock"> (In Stock)</span>
                    <span v-else> (Out of  Stock)</span>
                </h1>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <!-- <div v-for="variant in variants" :key="variant.variantId">
                    <p @mouseover="updateProduct(variant.variantImage)">
                        {{ variant.variantColor }}
                    </p>
                </div> -->

                <button v-on:click="addToCart" :disabled="!inStock">Add to cart</button>

                <div class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                >
                    <p @mouseover="updateProduct(index)">
                        {{ variant.variantColor }}
                    </p>
                </div>

                <product-tabs :reviews="reviews"></product-tabs>

                <div class="product-image">
                    <img :src="image" />
                </div>
            </div>
        </div>
    `,
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            selectedVariant: 0,
            reviews: [],
            variants: [
                {
                    variantId: 1234,
                    variantColor: "green",
                    variantImage: "./assets/green_socks.jpg",
                    variantQuantity: 10,
                    variantDescription: "A pair of green socks.",
                },
                {
                    variantId: 1235,
                    variantColor: "red",
                    variantImage: "./assets/red_socks.jpg",
                    variantQuantity: 0,
                    variantDescription: "A pair of red socks.",
                },
            ]
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
            }
        }
    },
});

Vue.component('product-tabs', {
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
            >
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
    }
});
