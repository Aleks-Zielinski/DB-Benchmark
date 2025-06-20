[{$match: {
    name: { $regex: "a$", $options: "i" }
  }
},
{$lookup: {
    from: "Cities",
    localField: "id",
    foreignField: "country_id",
    as: "cities"
  }
},
{ $unwind: "$cities" },
{$lookup: {
    from: "Scientists",
    localField: "cities.id",
    foreignField: "place_of_birth_id",
    as: "scientists"
  }
},
{ $unwind: "$scientists" },
{$lookup: {
    from: "Discoveries",
    let: { scientistId: "$scientists.id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$field_of_science_id", 1] },
              { $in: ["$$scientistId", "$discovered_by_ids"] }
            ]
          }
        }
      }
    ],
    as: "discoveries"
  }
},
{ $unwind: "$discoveries" },
{$group: {
    _id: { country_id: "$id", country: "$name", discovery_id: "$discoveries.id", discovery_name: "$discoveries.name" }
  }
},
{$group: {
    _id: { country_id: "$_id.country_id", country: "$_id.country" },
    discoveries: { $addToSet: { id: "$_id.discovery_id", name: "$_id.discovery_name" } },
    count: { $sum: 1 }
  }
},
{ $sort: { count: -1 } },
{ $limit: 1 },
{$project: {
    _id: 0,
    country: "$_id.country",
    count: 1,
    discoveries: 1
  }
}]