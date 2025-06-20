[{$unwind: "$discovered_by_ids"
},
{$lookup: {
    from: "Scientists",
    localField: "discovered_by_ids",
    foreignField: "id",
    as: "scientist"
  }
},
{$unwind: "$scientist" },
{$lookup: {
    from: "Cities",
    localField: "scientist.place_of_birth_id",
    foreignField: "id",
    as: "city"
  }
},
{$unwind: "$city" },
{$lookup: {
    from: "Countries",
    localField: "city.country_id",
    foreignField: "id",
    as: "country"
  }
},
{$unwind: "$country" },
{$group: {
    _id: {
      country_id: "$country.id",
      country_name: "$country.name",
      discovery_id: "$id"
    },
    country_size: { $first: "$country.data.size" }
  }
},
{$group: {
    _id: {
      country_id: "$_id.country_id",
      country_name: "$_id.country_name"
    },
    discoveries_count: { $sum: 1 },
    country_size: { $first: "$country_size" }
  }
},
{$addFields: {
    avg_discoveries_per_km2: {
      $cond: [
        { $gt: ["$country_size", 0] },
        { $divide: ["$discoveries_count", "$country_size"] },
        null
      ]
    }
  }
},
{$sort: { avg_discoveries_per_km2: -1 } },
{$limit: 1 },
{$project: {
    _id: 0,
    country: "$_id.country_name",
    discoveries_count: 1,
    size: "$country_size",
    avg_discoveries_per_km2: { $round: ["$avg_discoveries_per_km2", 6] }
  }
}]

