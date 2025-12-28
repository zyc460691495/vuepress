const redis = require('redis');
const db = redis.createClient({
    socket: {
        host: "localhost",
        port: 6379
    },
    password: "zzz123456"
});
await db.connect();

class Entry {
    constructor(obj) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    static getRange(from, to, cb) {
        // 用来获取消息记录 Redis lrange 函数
        db.lrange('entries', from, to, (err, items) => {
            if (err) return cb(err);
            let entries = [];
            items.forEach((item) => {
                entries.push(JSON.parse(item));
            });
            cb(null, entries);
        });
    }


    save(cb) {
        const entryJSON = JSON.stringify(this);
        // 将保存的消息转换成 JSON 字符串, 存到 Redis 列表中
        db.lpush(
            'entries',
            entryJSON,
            (err) => {
                if (err) return cb(err);
                cb();
            }
        );
    }
}

module.exports = Entry;