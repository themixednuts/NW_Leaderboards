
import { sql, eq, or, inArray, and, like } from "drizzle-orm";
import { db } from "./client";
import { characters, guilds } from "./schema";
import { alias, union } from "drizzle-orm/sqlite-core";

const requestingCharacter = alias(characters, 'requesting')

// PREPARED STATEMENTS
export const p_characters_by_user = db.query.characters.findMany({
  columns: {
    userId: false,
    id: false,
  },
  with: {
    guild: {
      columns: {
        id: false
      }
    }
  },
  where: (eq(characters.userId, sql.placeholder('userId'))),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user')
  }
}).prepare()

export const p_character_by_id = db.query.characters.findFirst({
  columns: {
    userId: false,
    id: false,
    submittedAt: false,
    guildId: false
  },
  with: {
    guild: {
      columns: {
        id: false,
        guildmasterId: false,
        submittedAt: false
      }
    }
  },
  where: (
    and(
      eq(characters.id, sql.placeholder('id')),
      or(
        eq(characters.userId, sql.placeholder('userId')),
        inArray(characters.visibility, ['public']),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer']),
      )
    )

  ),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user'),
  }
}).prepare()

export const p_character_by_name = db.query.characters.findFirst({
  columns: {
    userId: false,
    id: false,
    guildId: false,
    submittedAt: false
  },
  with: {
    guild: {
      columns: {
        id: false,
        guildmasterId: false,
        submittedAt: false
      }
    }
  },
  where: (
    and(
      eq(characters.name, sql.placeholder('name')),
      or(
        eq(characters.userId, sql.placeholder('userId')),
        inArray(characters.visibility, ['public']),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer']),
      )
    )

  ),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user'),
  }
}).prepare()

export const p_characters_by_name = db.query.characters.findMany({
  columns: {
    userId: false,
    id: false,
    guildId: false,
    submittedAt: false
  },
  with: {
    guild: {
      columns: {
        id: false,
        guildmasterId: false,
        submittedAt: false
      }
    }
  },
  where: (
    and(
      eq(characters.name, sql.placeholder('name')),
      or(
        eq(characters.userId, sql.placeholder('userId')),
        inArray(characters.visibility, ['public']),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer']),
      )
    )

  ),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user'),
  }
}).prepare()

export const p_guilds_with_members_by_user = db.query.guilds.findMany({
  columns: {
    id: false,
  },
  with: {
    characters: {
      columns: {
        userId: false,
        id: false,
      },
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
  },
  where: inArray(guilds.id, db.select({ id: characters.guildId }).from(characters).where(eq(characters.userId, sql.placeholder('userId'))))

}).prepare()

export const p_guild_with_members_by_id = db.query.guilds.findFirst({
  columns: {
    id: false,
  },
  with: {
    characters: {
      columns: {
        userId: false,
        id: false,
      },
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
    guildmaster: {
      columns: {
        userId: false,
        id: false,
      },
    }
  },
  where: eq(guilds.id, sql.placeholder('id')),
}).prepare()
export const p_guild_with_members_by_name = db.query.guilds.findFirst({
  columns: {
    id: false
  },
  with: {
    characters: {
      columns: {
        userId: false,
        id: false,
      },
      where: or(
        eq(characters.userId, sql.placeholder('userId')),
        eq(characters.visibility, 'public'),
        and(
          eq(characters.visibility, 'guild'),
          inArray(characters.guildId, db.select({ guildId: requestingCharacter.guildId }).from(requestingCharacter).where(eq(requestingCharacter.userId, sql.placeholder('userId'))))
        ),
        inArray(sql.placeholder('role'), ['admin', 'maintainer'])
      )
    },
    guildmaster: {
      columns: {
        userId: false,
        id: false,
      },
    }
  },
  where: eq(guilds.name, sql.placeholder('name')),
}).prepare()

export const p_company_by_id = db.query.guilds.findFirst({
  columns: {
    id: false
  },
  with: {
    guildmaster: {
      columns: {
        userId: false,
        id: false,
      },
    }
  },
  where: eq(guilds.id, sql.placeholder('id')),
}).prepare()

export const p_visible_characters_guilds = db.query.characters.findMany({
  columns: {
    userId: false,
    id: false
  },
  with: {
    guild: {
      columns: {
        id: false
      }
    }
  },
  where: (eq(characters.userId, sql.placeholder('userId'))),
  extras: {
    ownedByUser: inArray(characters.userId, [sql.placeholder('userId')]).as('owned_by_user')
  }
}).prepare()


export const p_guild_data_by_name = db.query.guilds.findFirst({
  columns: {
    guildmasterId: false,
    id: false
  },
  with: {
    guildmaster: {
      columns: {
        name: true
      },
      // extras: {
      //   userIsGuildMaster: inArray()
      // }
    }
  },
  where: eq(guilds.name, sql.placeholder('name'))
})


export const p_search = union(
  db.select({ id: characters.id, name: characters.name, type: sql<string>`'character'` }).from(characters)
    .where(
      and(
        like(characters.name, sql`'%' || ${sql.placeholder('name')} || '%'`),
        or(
          eq(characters.userId, sql.placeholder('userId')),
          eq(characters.visibility, 'public'),
          inArray(sql.placeholder('role'), ['admin', 'maintainer'])
        )
      )
    ),
  db.select({ id: guilds.id, name: guilds.name, type: sql<string>`'company'` }).from(guilds).where(like(guilds.name, sql`'%' || ${sql.placeholder('name')} || '%'`)),
).limit(sql.placeholder('limit')).prepare()
