Meteor.startup(function () {
    if (Cards.find().count() === 0) {
        var data = [
            {
                type: "Burger",
                entities: [
                    {
                        name: "Big Mac",
                        snippet: "classical Macdonald Burger",
                        availability: true,
                        ingredients: ['broat',
                                'tomato',
                                'cheese',
                                'cornichon']
                 },
                    {
                        name: "Giant Classic",
                        snippet: "classical Burger king",
                        availability: true,
                        ingredients: ['broat',
                                'steak',
                                'cheese',
                                'ketchup']
                 }]
            },
            {
                type: "Entry",
                entities: [
                    {
                        name: "French Salad",
                        snippet: "Classic French Salad",
                        availability: false,
                        ingredients: ['salad',
                                'tomato',
                                'cheddar']
                 },
                    {
                        name: 'greek salad',
                        snippet: 'Classic Greek Salad',
                        availability: true,
                        ingredients: ['salad',
                                'tomato',
                                'salakis',
                                'brebis']
                 }]
            },
            {
                type: "Drink",
                entities: [
                    {
                        name: "Coca-Cola",
                        snippet: "Most Famous drink around the world",
                        availability: true,
                        ingredients: []
                            },
                    {
                        name: 'Fischer',
                        snippet: "Alsacian Beer",
                        availability: true,
                        ingredients: ['malt',
                                              'love']
                            }]
                    }]
        for (var i = 0; i < data.length; i++) {
            Cards.insert({
                type: data[i].type,
                entities: data[i].entities
            });
            for (var j = 0; j < data[i].entities.length; j++) {
                Entity.insert({
                    _idcard: Cards.find({
                        type: data[i].type
                    })._id,
                    type: data[i].type,
                    name: data[i].entities[j].name,
                    snippet: data[i].entities[j].snippet,
                    availability: data[i].entities[j].availability,
                    ingredients: data[i].entities[j].ingredients,
                });
            }
        }
    }
    console.log(Cards);

});
