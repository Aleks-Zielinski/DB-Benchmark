[{$match: { 
        field_of_science_id: 2, 
        year_of_discovery: { $gt: 1960 }
    }
},
    { $unwind: "$discovered_by_ids" },

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
{$group: {
    _id: {
      country_id: "$city.country_id",
      discovery_id: "$id",
      discovery_name: "$name"
    }
  }
},
{$lookup: {
    from: "Countries",
    localField: "_id.country_id",
    foreignField: "id",
    as: "country"
  }
},
{$unwind: "$country" },
{$group: {
    _id: "$country.name",
    discoveries: { $addToSet: { id: "$_id.discovery_id", name: "$_id.discovery_name" } },
    count: { $sum: 1 }
  }
},
{$sort: { count: -1 } },
{$project: {
    _id: 0,
    country: "$_id",
    count: 1,
    discoveries: 1
  }
}]


