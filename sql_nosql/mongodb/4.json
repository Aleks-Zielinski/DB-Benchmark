[{$lookup: {
    from: "Scientists",
    localField: "discovered_by_ids",
    foreignField: "id", 
    as: "scientist"
  }
},
{ $unwind: "$scientist" },
{$lookup: {
    from: "Cities",
    localField: "scientist.place_of_birth_id",
    foreignField: "id",
    as: "city"
  }
},
{ $unwind: "$city" },
{$lookup: {
    from: "Countries",
    localField: "city.country_id",
    foreignField: "id",
    as: "country"
  }
},
{ $unwind: "$country" },
{$lookup: {
    from: "Continents",
    localField: "country.continent_id",
    foreignField: "id",
    as: "continent"
  }
},
{ $unwind: "$continent" },
{$group: {
    _id: {
      continent_id: "$continent.id",
      continent_name: "$continent.name",
      country_id: "$country.id",
      country_name: "$country.name",
      discovery_id: "$id"
    }
  }
},
{$group: {
    _id: {
      continent_id: "$_id.continent_id",
      continent_name: "$_id.continent_name",
      country_id: "$_id.country_id",
      country_name: "$_id.country_name" },
    discoveries_count: { $sum: 1 }
  }
},
{$group: {
    _id: {
      continent_id: "$_id.continent_id",
      continent_name: "$_id.continent_name"},
    average_discoveries_per_country: { $avg: "$discoveries_count" },
    countries: {
      $push: {
        country_id: "$_id.country_id",
        country_name: "$_id.country_name",
        discoveries_count: "$discoveries_count"
      }
    }
  }
},
{
  $project: {
    _id: 0,
    continent_id: "$_id.continent_id",
    continent_name: "$_id.continent_name",
    average_discoveries_per_country: { $round: ["$average_discoveries_per_country", 2] },
  }
},
{$sort: { continent_name: 1 } }
]

