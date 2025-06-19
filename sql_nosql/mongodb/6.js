[{$lookup: {
    from: "Cities",
    localField: "place_of_birth_id",
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
{$lookup: {
    from: "Discoveries",
    let: { scientistId: "$id" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$$scientistId", "$discovered_by_ids"] }
        }
      }
    ],
    as: "discoveries"
  }
},
{$addFields: {
    discoveries_count: { $size: "$discoveries" }
  }
},
{$group: {
    _id: "$continent.name",
    total_discoveries: { $sum: "$discoveries_count" },
    scientists_count: { $sum: 1 }
  }
},
{$project: {
    _id: 0,
    continent: "$_id",
    avg_discoveries_per_scientist: {
      $cond: [
        { $eq: ["$scientists_count", 0] },
        0,
        { $round: [{ $divide: ["$total_discoveries", "$scientists_count"] }, 2] }
      ]
    },
    total_discoveries: 1,
    scientists_count: 1
  }
},
{$sort: { continent: 1 } }
]
