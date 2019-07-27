<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';
  import { subscribe } from 'svelte-apollo';
  const AUTHOR_LIST = gql`
    subscription {
      profile {
		id
		name
      }
    }
  `;
  const authorsList = subscribe(client, { query: AUTHOR_LIST });
</script>

<script>
	const name = 'Eve + svelte';
</script>

<h1>Hello {name}!</h1>


<ul>
  {#await $authorsList}
    <li>Loading...</li>
  {:then result}
    {#each result.data.profile as profile}
      <li>{profile.name}</li>
    {:else}
      <li>No authors found</li>
    {/each}
  {:catch error}
    <li>Error loading authors: {error.message}</li>
  {/await}
</ul>
