riot.tag('top', ' <h3>{ vars.title }</h3> <ul> <li each="{ item, i in items }">{ item.text } @ { item.createdAt }</li> </ul> <form onsubmit="{ add }"> <input> <button>Add #{ items.length + 1 }</button> </form>  ', 'top h3, [riot-tag="top"] h3{ font-size: 14px; }', function(opts) {
    this.items = [];

    this.add = function(e) {
      var input = e.target[0];
      this.items.push({
        text: input.value,
        createdAt: Date.now()
      });
      input.value = ''
    }.bind(this);
  
});
