<script>
  import gql from "graphql-tag";

  const insert_project = gql`
    mutation ($rate: Int!, $abbr: String!, $name: String!) {
      insert_project (objects: {rate: $rate, abbr: $abbr, name: $name}) {
        returning {
          id
          abbr
          name
        }
      }
    }
  `;

  import { client } from './apollo';
  import { mutate } from 'svelte-apollo';

  let name = '';
  let abbr = '';
  let rate = '';

  function handleSubmit() {
    mutate(client, {
      mutation: insert_project,
      variables: { name, abbr, rate }
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <p>
    <label>
      Name
    </label>
    <input type="text" bind:value={name}>
  </p>
  <p>
    <label>
      Abbr
      <input type="text" bind:value={abbr}>
    </label>
  </p>
  <p>
    <label>
      Rate
      <input type="number" bind:value={rate} min="0">
    </label>
  </p>
  <button>Save</button>
</form>
