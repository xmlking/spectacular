

<script lang="ts">
import { streamObject } from 'ai';
import { chromeai } from 'chrome-ai';
  import { onMount } from 'svelte';
import { z } from 'zod';

onMount(async() =>{
const { partialObjectStream } = await streamObject({
  model: chromeai(),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        })
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(JSON.stringify(partialObject, null, 2));
  // { recipe: {...} }
}
})


</script>
