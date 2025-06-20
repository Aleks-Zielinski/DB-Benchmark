[{$match: {
    field_of_science_id: 2
  }
},
{$unwind: "$discovered_by_ids"
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
    as: "birth_city"
  }
},
{$unwind: "$birth_city" },
{$match: {
    "birth_city.country_id": 6
  }
},
{$group: {
    _id: {
      id: "$id",
      name: "$name",
      year_of_discovery: "$year_of_discovery"
    }
  }
},
{$sort: { "_id.year_of_discovery": 1 } },
{$group: {
    _id: null,
    discoveries: { $push: "$_id" }
  }
},
{$project: {
    _id: 0,
    oldest: { $arrayElemAt: ["$discoveries", 0] },
    youngest: { $arrayElemAt: ["$discoveries", -1] }
  }
}]

