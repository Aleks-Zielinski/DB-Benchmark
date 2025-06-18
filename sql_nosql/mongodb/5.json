[{$unwind: "$discovered_by_ids"
},
{$lookup: {
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
{$match: {
    "country.continent_id": 1
  }
},
{$group: {
    _id: {
      country_id: "$country.id",
      country_name: "$country.name",
      field_of_science_id: "$field_of_science_id"
    },
    discoveries_count: { $sum: 1 }
  }
},
{$sort: {
    "_id.country_name": 1,
    discoveries_count: -1
  }
},
{$group: {
    _id: "$_id.country_name",
    field_of_science_id: { $first: "$_id.field_of_science_id" },
    discoveries_count: { $first: "$discoveries_count" }
  }
},
{$lookup: {
    from: "Field_of_sciences",
    localField: "field_of_science_id",
    foreignField: "id",
    as: "science"
  }
},
{ $unwind: "$science" },
{$project: {
    _id: 0,
    country: "$_id",
    field_of_science: "$science.name",
    discoveries_count: 1
  }
},
{$sort: { country: 1 } }
]
