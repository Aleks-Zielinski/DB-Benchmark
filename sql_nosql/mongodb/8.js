[{$lookup: {
    from: "Discoveries",
    let: { scientistId: "$id" },
    pipeline: [
      {
        $match: {
          field_of_science_id: 1,
          $expr: { $in: ["$$scientistId", "$discovered_by_ids"] }
        }
      }
    ],
    as: "physics_discoveries"
  }
},
{$match: {
    "physics_discoveries.0": { $exists: true }
  }
},
{$group: {
    _id: "$place_of_birth_id",
    physicists_count: { $sum: 1 }
  }
},
{$lookup: {
    from: "Cities",
    localField: "_id",
    foreignField: "id",
    as: "city"
  }
},
{$unwind: "$city" },
{$sort: { physicists_count: -1 } },
{$limit: 1 },
{$project: {
    _id: 0,
    city: "$city.name",
    country_id: "$city.country_id",
    physicists_count: 1
  }
}]

