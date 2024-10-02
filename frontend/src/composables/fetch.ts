import { ref, toValue, watchEffect, type Ref } from "vue";

export function useFetch(url: string | Ref<string> | (() => string)) {
  const data = ref<any>(null);
  const headers = ref<Headers | null>(null);
  const error = ref<any>(null);

  function fetchData() {
    // Reset state before fetching
    data.value = null;
    headers.value = null
    error.value = null;

    // Fetch data
    fetch(toValue(url))
      .then((res) => { 
        headers.value = res.headers;
        return res.json()
      })
      .then((json) => { 
        data.value = json;
      })
      .catch((err) => (error.value = err));
  }

  watchEffect(() => {
    fetchData();
  });

  return { data, headers, error };
}