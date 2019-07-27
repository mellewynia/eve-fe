<script>
  import gql from 'graphql-tag';

  const insert_reg = gql`
    mutation (
      $info: String!,
      $projectId: Int, $rate: Int,
      $startDate: timestamptz!, $endDate: timestamptz
    ) {
      insert_reg (objects: {
        info: $info,
        projectId: $projectId, rate: $rate,
        startDate: $startDate, endDate: $endDate
      }) {
        returning {
          id
          info
        }
      }
    }
  `;

  let info = '';
  let projectId = null;
  let rate = null;
  let startDate = '2019-07-27T18:30:04+00:00';
  let endDate = null;

  import { client } from './apollo';
  import { mutate } from 'svelte-apollo';

  function handleSubmit () {
    mutate(client, {
      mutation: insert_reg,
      variables: { info, projectId, rate, startDate, endDate }
    }).catch(e => {
      console.log(e);
    })
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <p>
    <label>Info</label>
    <input 
      type="text" bind:value={info}
    >
  </p>
  <div>
    <p>
      <label>Project</label>
      <select>
        
      </select>
    </p>
    <p>
      <label>Rate</label>
      <input
        type="number" bind:value={rate}
      >
    </p>
  </div>
  <div>
    <p>
      <label>Start</label>
      <input
        type="text" bind:value={startDate}
        placeholder=""
      >
    </p>
    <p>
      <label>End</label>
      <input
        type="text" bind:value={endDate}
      >
    </p>
  </div>
  <p>
    <button>Save</button>
  </p>
</form>
