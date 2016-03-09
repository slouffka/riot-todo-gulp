<top>

  <!-- layout -->
  <h3>{ vars.title }</h3>

  <ul>
    <li each={ item, i in items }>{ item.text } @ { item.createdAt }</li>
  </ul>

  <form onsubmit={ add }>
    <input>
    <button>Add #{ items.length + 1 }</button>
  </form>

  <!-- style -->
  <style scoped>
    h3 {
      font-size: 14px;
    }
  </style>

  <!-- logic -->
  <script>
    this.items = [];

    add(e) {
      var input = e.target[0];
      this.items.push({
        text: input.value,
        createdAt: Date.now()
      });
      input.value = ''
    }
  </script>

</top>
