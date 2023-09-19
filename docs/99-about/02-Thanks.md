---

---

# Thank you

<div>
  <h3>Contributors:</h3>
  <ul v-if="contributors.length">
    <li v-for="contributor in contributors" :key="contributor.id">
      <a :href="contributor.html_url" target="_blank">
        <img :src="contributor.avatar_url" alt="avatar" width="30" />
        {{ contributor.login }}
      </a>
    </li>
  </ul>
  <p v-else>Loading contributors...</p>
</div>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    owner: {
      type: String,
      required: true
    },
    repo: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const contributors = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/docmoa/docs/contributors`);
        contributors.value = await response.json();
      } catch (error) {
        console.error("Failed to fetch contributors:", error);
      }
    });

    return {
      contributors
    };
  }
};
</script>